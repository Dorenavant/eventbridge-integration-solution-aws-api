/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

package software.amazon.events.ecs.resource;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;
import software.amazon.events.ecs.model.Event;
import software.amazon.events.ecs.model.Order;
import software.amazon.events.ecs.repository.OrderRepository;

import javax.validation.Valid;
import java.util.Objects;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@Slf4j
@RequestMapping(path = "/orders")
@RestController
public class OrderResource {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderResource(OrderRepository orderRepository) {
        this.orderRepository = Objects.requireNonNull(orderRepository);
    }

    @RequestMapping(method = PUT)
    public Mono<ResponseEntity<Object>> onEvent(@Valid @RequestBody Event<Order> event) {

        log.info("Processing order {}", event.getDetail().getOrderId());

        return orderRepository.save(event.getDetail())
                .map(order -> ResponseEntity.created(
                        UriComponentsBuilder.fromPath("/orders/{id}").build(order.getOrderId()))
                        .build()
                ).onErrorResume(error -> {
                    log.error("Unhandled error occurred", error);
                    return Mono.just(ResponseEntity.status(INTERNAL_SERVER_ERROR).build());
                });
    }
}
