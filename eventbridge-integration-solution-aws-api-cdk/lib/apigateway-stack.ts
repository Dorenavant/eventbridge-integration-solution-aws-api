/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import * as cdk from '@aws-cdk/core';
import * as elasticloadbalancing from '@aws-cdk/aws-elasticloadbalancingv2';
import * as apigateway from '@aws-cdk/aws-apigateway';

export interface ApiGatewayProperties extends cdk.StackProps {
    readonly loadBalancer: elasticloadbalancing.IApplicationLoadBalancer;
}

export class ApiGatewayStack extends cdk.Stack {
    readonly restApi: apigateway.RestApi;
    readonly apiGatewayArn: string;

    constructor(scope: cdk.App, id: string, props: ApiGatewayProperties) {
        super(scope, id, props);
        const method = 'PUT';
        const path = '/orders';
        const url = 'http://' + props.loadBalancer.loadBalancerDnsName;

        this.restApi = new apigateway.RestApi(this, 'EventsRestApi');
        this.addResource(this.restApi, url, 'orders', method, path);
        this.apiGatewayArn = this.restApi.arnForExecuteApi(method, path, this.restApi.deploymentStage.stageName);
    }

    private addResource(api: apigateway.RestApi, baseUrl: string, name: string, method: string, path: string) {
        const events = api.root.addResource(name);
        let eventIntegration = new apigateway.HttpIntegration(baseUrl + path, {
            httpMethod: method
        });
        events.addMethod(method, eventIntegration);
    }
}