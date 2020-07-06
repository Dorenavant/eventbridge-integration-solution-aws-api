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

import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.Date;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Event<T> {

    @NotNull
    @JsonProperty("version")
    private String version;

    @NotNull
    @JsonProperty("region")
    private String region;

    @NotNull
    @JsonProperty("account")
    private String account;

    @NotNull
    @JsonProperty("id")
    private String id;

    @NotNull
    @JsonProperty("source")
    private String source;

    @NotNull
    @JsonProperty("detail-type")
    private String detailType;

    @NotNull
    @JsonProperty("resources")
    private Collection<String> resources;

    @NotNull
    @JsonProperty("time")
    private Date time;

    @NotNull
    @JsonProperty("detail")
    private T detail;
}
