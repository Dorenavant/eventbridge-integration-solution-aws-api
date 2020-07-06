#!/usr/bin/env node

/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import * as cdk from '@aws-cdk/core';
import {VpcStack} from '../lib/vpc-stack';
import {DocumentDbStack} from '../lib/document-db-stack';
import {EcsStack} from '../lib/ecs-stack';
import {ApiGatewayStack} from '../lib/apigateway-stack';
import * as crypto from 'crypto';
import {EcrRegistryStack} from '../lib/ecr-registry-stack';
import {EventsStack} from "../lib/events-stack";

const app = new cdk.App();

const repository = new EcrRegistryStack(app, 'EventsRegistry', {
    repositoryName: 'eventbridge-integration-solution-aws-api'
});

const vpc = new VpcStack(app, 'EventsVpc');

const documentDb = new DocumentDbStack(app, 'EventsDB', {
    vpc: vpc.vpc,
    desiredCount: 3,
    clusterIdentifier: 'events-db-cluster',
    username: 'documentdb',
    password: crypto.randomBytes(20).toString('hex'),
    instanceClass: 'db.r5.large',
});
documentDb.addDependency(vpc);

const ecs = new EcsStack(app, 'EventsEcs', {
    repository: repository.repository,
    vpc: vpc.vpc,
    dbSecurityGroupId: documentDb.securityGroupId,
    documentDBUri: documentDb.documentDBUri
});
ecs.addDependency(documentDb);

const apiGateway = new ApiGatewayStack(app, 'EventsApiGateway', {
    loadBalancer: ecs.loadBalancer
});
apiGateway.addDependency(ecs);

const events = new EventsStack(app, 'Events', {
    restApi: apiGateway.restApi,
    apiGatewayArn: apiGateway.apiGatewayArn
});
events.addDependency(apiGateway);
