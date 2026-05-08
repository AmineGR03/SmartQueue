package com.smartqueue.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private Integer averageDuration;

    @Builder.Default
    private Boolean active = true;

    @OneToMany(mappedBy = "service")
    private List<Ticket> tickets;

    @OneToMany(mappedBy = "service")
    private List<Appointment> appointments;
}