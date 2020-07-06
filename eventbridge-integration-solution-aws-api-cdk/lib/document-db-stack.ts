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
import * as db from '@aws-cdk/aws-docdb';

export interface DocumentDbProperties extends cdk.StackProps {
    readonly vpc: ec2.Vpc;
    readonly clusterIdentifier: string;
    readonly username: string;
    readonly password: string;
    readonly instanceClass: string;
    readonly desiredCount: number;
}

export class DocumentDbStack extends cdk.Stack {
    readonly securityGroupId: string;
    readonly documentDBUri: string;

    constructor(scope: cdk.App, id: string, props: DocumentDbProperties) {
        super(scope, id, props);

        const securityGroup = new ec2.SecurityGroup(this, 'EventsDocDBSecurityGroup', {
            vpc: props.vpc,
        });

        const subnetGroups = new db.CfnDBSubnetGroup(this, 'EventsDocDBSubnetGroup', {
            dbSubnetGroupName: 'EventsDBSubnetGroup',
            dbSubnetGroupDescription: 'DocumentDBSubnetGroup',
            subnetIds: props.vpc.publicSubnets.map((subnet: ec2.ISubnet) => subnet.subnetId)
        });

        const cluster = new db.CfnDBCluster(this, 'EventsDB', {
            dbClusterIdentifier: props.clusterIdentifier,
            masterUsername: props.username,
            masterUserPassword: props.password,
            port: 27017,
            storageEncrypted: true,
            dbSubnetGroupName: subnetGroups.ref,
            vpcSecurityGroupIds: [securityGroup.securityGroupId],
        });

        let availabilityZones = props.vpc.availabilityZones;
        for (let instance = 1; instance <= props.desiredCount; instance++) {
            const dbInstance = new db.CfnDBInstance(this, 'EventDocDBInstance' + instance, {
                dbClusterIdentifier: props.clusterIdentifier,
                dbInstanceClass: props.instanceClass,
                availabilityZone: availabilityZones[(instance - 1) % availabilityZones.length]
            });
            dbInstance.addDependsOn(cluster);
        }

        this.securityGroupId = securityGroup.securityGroupId;
        this.documentDBUri = this.createConnectionUri(props.username, props.password, cluster.attrEndpoint, cluster.attrPort)
    }

    private createConnectionUri(username: string, password: string, endpoint: string, port: string): string {
        return `mongodb://${username}:${password}@${endpoint}:${port}/?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`
    }
}