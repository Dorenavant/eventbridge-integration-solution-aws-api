/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import * as cdk from '@aws-cdk/core';
import * as ecr from '@aws-cdk/aws-ecr';

export interface EcrProperties extends cdk.StackProps {
    readonly repositoryName: string;
}

export class EcrRegistryStack extends cdk.Stack {
    readonly repository: ecr.Repository;

    constructor(scope: cdk.App, id: string, props: EcrProperties) {
        super(scope, id, props);

        this.repository = new ecr.Repository(this, props.repositoryName, {
            repositoryName: props.repositoryName,
            imageScanOnPush: true
        });
    }
}