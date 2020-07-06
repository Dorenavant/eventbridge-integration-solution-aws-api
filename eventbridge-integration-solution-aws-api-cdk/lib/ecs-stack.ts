/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecs_patterns from '@aws-cdk/aws-ecs-patterns';
import * as elasticloadbalancing from '@aws-cdk/aws-elasticloadbalancingv2';

export interface EcsProperties extends cdk.StackProps {
    readonly repository: ecr.Repository;
    readonly vpc: ec2.Vpc;
    readonly dbSecurityGroupId: string;
    readonly documentDBUri: string;
}

export class EcsStack extends cdk.Stack {
    readonly loadBalancer: elasticloadbalancing.IApplicationLoadBalancer;

    constructor(scope: cdk.App, id: string, props: EcsProperties) {
        super(scope, id, props);

        const cluster = new ecs.Cluster(this, 'EventsCluster', {
            vpc: props.vpc
        });

        const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'EventsService', {
            cluster: cluster,
            cpu: 1024,
            memoryLimitMiB: 2048,
            desiredCount: 3,
            publicLoadBalancer: true,
            taskImageOptions: {
                image: ecs.ContainerImage.fromEcrRepository(props.repository, 'latest'),
                containerPort: 8080,
                environment: {
                    'spring.data.mongodb.uri': props.documentDBUri
                },
            },
        });

        props.repository.grantPull(service.taskDefinition.taskRole);
        service.targetGroup.configureHealthCheck({
            path: '/health'
        });

        const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'EventsDBSecurityGroup', props.dbSecurityGroupId);
        securityGroup.connections.allowFrom(service.service, ec2.Port.tcp(27017));

        this.loadBalancer = service.loadBalancer;
    }
}
