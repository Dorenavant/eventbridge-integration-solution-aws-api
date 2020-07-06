/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as events_stack from '../lib/events-stack';
import {expect as expectCDK, haveResource} from '@aws-cdk/assert';

test('Events Created', () => {
    const app = new cdk.App();
    const restApi = new apigateway.RestApi(app, 'TestRestApi');
    const apigatewayArn = 'arn:aws:execute-api:us-west-2:123456789012-id:abcdefgh/*/PUT/orders';
    // WHEN
    const stack = new events_stack.EventsStack(app, 'EventsTestStack', {
        restApi: restApi,
        apiGatewayArn: apigatewayArn
    });
    // THEN
    expectCDK(stack).to(haveResource('AWS::IAM::Role'));
    expectCDK(stack).to(haveResource('AWS::Events::Rule'));
});