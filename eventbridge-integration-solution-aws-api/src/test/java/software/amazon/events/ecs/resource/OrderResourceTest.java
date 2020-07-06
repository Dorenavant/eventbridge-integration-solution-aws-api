/*
 * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT
 *
 * Licensed under the MIT License. See the LICENSE accompanying this file
 * for the specific language governing permissions and limitations under
 * the License.
 */

package software.amazon.events.ecs.resource;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.Resource;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;
import software.amazon.events.ecs.model.Event;
import software.amazon.events.ecs.model.Order;
import software.amazon.events.ecs.repository.OrderRepository;

import java.io.IOException;
import java.io.InputStream;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@WebFluxTest
class OrderResourceTest {

    private static final String ORDERS_PATH = "/orders";

    @MockBean
    private OrderRepository orderRepository;

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("classpath:/event.json")
    private Resource event;

    @Test
    public void shouldPutOrderSuccessfully() throws Exception {
        // given
        when(orderRepository.save(any(Order.class))).thenReturn(Mono.just(new Order()));

        // when
        WebTestClient.ResponseSpec actual = webTestClient.put()
                .uri(ORDERS_PATH)
                .bodyValue(createOrderEvent())
                .exchange();

        // then
        actual.expectStatus().isEqualTo(CREATED);
    }

    @Test
    public void shouldFailToPutMalformedOrder() throws Exception {
        // given
        when(orderRepository.save(any(Order.class))).thenReturn(Mono.just(new Order()));

        // when
        WebTestClient.ResponseSpec actual = webTestClient.put()
                .uri(ORDERS_PATH)
                .bodyValue(new Event<>())
                .exchange();

        // then
        actual.expectStatus().isEqualTo(BAD_REQUEST);
    }

    @Test
    public void shouldFailDueToServerError() throws Exception {
        // given
        when(orderRepository.save(any(Order.class))).thenReturn(Mono.error(
                new RuntimeException("Failed to persist order")));

        // when
        WebTestClient.ResponseSpec actual = webTestClient.put()
                .uri(ORDERS_PATH)
                .bodyValue(createOrderEvent())
                .exchange();

        // then
        actual.expectStatus().isEqualTo(INTERNAL_SERVER_ERROR);
    }

    private Event<Order> createOrderEvent() throws IOException {
        try (InputStream input = event.getInputStream()) {
            return objectMapper.readValue(input, new TypeReference<>() {});
        }
    }
}