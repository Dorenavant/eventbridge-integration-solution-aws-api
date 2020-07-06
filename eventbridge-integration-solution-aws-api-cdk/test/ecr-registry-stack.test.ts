/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import * as cdk from '@aws-cdk/core';
import * as ecr_stack from '../lib/ecr-registry-stack';
import {expect as expectCDK, haveResource} from '@aws-cdk/assert';

test('Registry Created', () => {
    const app = new cdk.App();
    const repositoryName = 'Repo';
    // WHEN
    const stack = new ecr_stack.EcrRegistryStack(app, 'EcrTestStack', {
        repositoryName: repositoryName
    });
    // THEN
    expect(stack.repository).not.toBeNull();
    expectCDK(stack).to(haveResource('AWS::ECR::Repository'));
});