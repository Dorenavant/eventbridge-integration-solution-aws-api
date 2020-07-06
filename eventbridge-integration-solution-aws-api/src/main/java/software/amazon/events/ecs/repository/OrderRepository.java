/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

package software.amazon.events.ecs.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import software.amazon.events.ecs.model.Order;

public interface OrderRepository extends ReactiveMongoRepository<Order, String> {
}
