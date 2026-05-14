package com.smartqueue.dto;

import com.smartqueue.entity.ServiceEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {

    private Long id;

    @NotBlank(message = "name is required")
    private String name;

    private String description;

    private Integer averageDuration;

    private Boolean active;

    public static ServiceDTO fromEntity(ServiceEntity entity) {
        if (entity == null) {
            return null;
        }
        return ServiceDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .averageDuration(entity.getAverageDuration())
                .active(entity.getActive())
                .build();
    }

    public ServiceEntity toNewEntity() {
        return ServiceEntity.builder()
                .name(name)
                .description(description)
                .averageDuration(averageDuration)
                .active(active != null ? active : Boolean.TRUE)
                .build();
    }
}
