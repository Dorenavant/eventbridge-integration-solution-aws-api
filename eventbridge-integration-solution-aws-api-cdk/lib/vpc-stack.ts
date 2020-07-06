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

export class VpcStack extends cdk.Stack {
    readonly vpc: ec2.Vpc;

    constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
        super(scope, id, props);

        this.vpc = new ec2.Vpc(this, 'EventsVpc', {
            maxAzs: 3
        });
    }
}