/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

import * as cdk from '@aws-cdk/core';
import * as vpc_stack from '../lib/vpc-stack';
import {expect as expectCDK, haveResource} from '@aws-cdk/assert';

test('VPC Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new vpc_stack.VpcStack(app, 'VpcTestStack');
    // THEN
    expect(stack.vpc).not.toBeNull();
    expectCDK(stack).to(haveResource('AWS::EC2::VPC'));
});