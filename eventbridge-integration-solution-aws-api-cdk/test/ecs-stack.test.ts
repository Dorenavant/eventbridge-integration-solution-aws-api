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
import * as ecs_stack from '../lib/ecs-stack';
import {expect as expectCDK, haveResource} from '@aws-cdk/assert';

test('Cluster Created', () => {
    const app = new cdk.App();
    const vpc = new ec2.Vpc(app, 'Vpc');
    const repository = new ecr.Repository(app, 'Repo');
    const securityGroupId = 'securityGroup';
    // WHEN
    const stack = new ecs_stack.EcsStack(app, 'EcsTestStack', {
        repository: repository,
        vpc: vpc,
        dbSecurityGroupId: securityGroupId,
        documentDBUri: 'mongo://localhost'
    });
    // THEN
    expectCDK(stack).to(haveResource('AWS::ECS::Cluster'));
});

test('Service Created', () => {
    const app = new cdk.App();
    const vpc = new ec2.Vpc(app, 'Vpc');
    const repository = new ecr.Repository(app, 'Repo');
    const securityGroupId = 'securityGroup';
    // WHEN
    const stack = new ecs_stack.EcsStack(app, 'EcsTestStack', {
        repository: repository,
        vpc: vpc,
        dbSecurityGroupId: securityGroupId,
        documentDBUri: 'mongo://localhost'
    });
    // THEN
    expectCDK(stack).to(haveResource('AWS::ECS::Service'));
});

test('ApplicationLoadBalancer Created', () => {
    const app = new cdk.App();
    const vpc = new ec2.Vpc(app, 'Vpc');
    const repository = new ecr.Repository(app, 'Repo');
    const securityGroupId = 'securityGroup';
    // WHEN
    const stack = new ecs_stack.EcsStack(app, 'EcsTestStack', {
        repository: repository,
        vpc: vpc,
        dbSecurityGroupId: securityGroupId,
        documentDBUri: 'mongo://localhost'
    });
    // THEN
    expect(stack.loadBalancer).not.toBeNull();
    expectCDK(stack).to(haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer'));
});
