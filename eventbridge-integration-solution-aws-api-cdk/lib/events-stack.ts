/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import * as cdk from "@aws-cdk/core";
import * as events from '@aws-cdk/aws-events';
import * as iam from "@aws-cdk/aws-iam";
import * as apigateway from "@aws-cdk/aws-apigateway";

export interface EventsProperties extends cdk.StackProps {
    readonly restApi: apigateway.RestApi;
    readonly apiGatewayArn: string;
}

export class EventsStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string, props: EventsProperties) {
        super(scope, id, props);

        const rule = new events.Rule(this, 'EventsRule', {
            eventPattern: {'source': ['ecommerce'], detailType: ['CreateOrder']},
            targets: [new ApiGatewayTarget(props.restApi, props.apiGatewayArn)]
        });
    }
}

class ApiGatewayTarget implements events.IRuleTarget {
    private readonly restApi: apigateway.RestApi;
    private readonly apiGatewayArn: string;

    constructor(restApi: apigateway.RestApi, apiGatewayArn: string) {
        this.restApi = restApi;
        this.apiGatewayArn = apiGatewayArn;
    }

    bind(rule: events.IRule, id?: string): events.RuleTargetConfig {
        const role = new iam.Role(this.restApi, 'EventRole', {
            assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
        });
        role.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["execute-api:Invoke"],
            resources: [this.apiGatewayArn]
        }));

        return {
            id: '',
            arn: this.apiGatewayArn,
            role: role,
            targetResource: this.restApi,
        };
    }
}