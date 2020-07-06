/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

package software.amazon.events.ecs.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Order {

    @Id
    @JsonProperty("order_id")
    private String orderId;

    @JsonProperty("create_date")
    private Date createDate;

    @JsonProperty("items")
    private List<Item> items;

    @JsonProperty("customer")
    private Customer customer;

    @JsonProperty("delivery_address")
    private Address deliveryAddress;

    @JsonProperty("payment")
    private Payment payment;
}
