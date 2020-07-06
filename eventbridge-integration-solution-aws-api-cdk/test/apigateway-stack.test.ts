/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import * as cdk from '@aws-cdk/core';
import * as apigateway_stack from '../lib/apigateway-stack';
import {expect as expectCDK, haveResource} from '@aws-cdk/assert';
import * as elasticloadbalancing from "@aws-cdk/aws-elasticloadbalancingv2";
import * as ec2 from "@aws-cdk/aws-ec2";

test('ApiGateway Created', () => {
    const app = new cdk.App();
    const vpc = new ec2.Vpc(app, 'Vpc');
    const loadBalancer = new elasticloadbalancing.ApplicationLoadBalancer(app, 'LoadBalancer', {
        vpc: vpc,
    });
    // WHEN
    const stack = new apigateway_stack.ApiGatewayStack(app, 'ApiGatewayTestStack', {
        loadBalancer: loadBalancer
    });
    // THEN
    expectCDK(stack).to(haveResource('AWS::ApiGateway::RestApi'));
});