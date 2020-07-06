/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import * as cdk from '@aws-cdk/core';
import * as document_db_stack from '../lib/document-db-stack';
import {expect as expectCDK, haveResource} from '@aws-cdk/assert';
import * as ec2 from "@aws-cdk/aws-ec2";

test('DocumentDB Created', () => {
    const app = new cdk.App();
    const vpc = new ec2.Vpc(app, 'Vpc', {});
    const clusterIdentifier = "test-cluster";
    const username = "test";
    const password = "test";
    // WHEN
    const stack = new document_db_stack.DocumentDbStack(app, 'DocumentDbTestStack', {
        vpc: vpc,
        clusterIdentifier: clusterIdentifier,
        username: username,
        password: password,
        instanceClass: 'db.r5.large',
        desiredCount: 1,
    });
    // THEN
    expect(stack.documentDBUri).not.toBeNull();
    expect(stack.securityGroupId).not.toBeNull();
    expectCDK(stack).to(haveResource('AWS::DocDB::DBInstance'));
    expectCDK(stack).to(haveResource('AWS::DocDB::DBCluster'));
});