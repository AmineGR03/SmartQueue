package com.smartqueue.dto;

import com.smartqueue.entity.Role;
import com.smartqueue.entity.enums.RoleName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {

    private Long id;
    private RoleName name;

    public static RoleDTO fromEntity(Role role) {
        if (role == null) {
            return null;
        }
        return RoleDTO.builder()
                .id(role.getId())
                .name(role.getName())
                .build();
    }
}
