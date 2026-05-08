package com.smartqueue.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Entity
@Table(name = "counters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Counter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private Integer number;

    @Builder.Default
    private Boolean active = true;

    @OneToMany(mappedBy = "counter")
    private List<Ticket> tickets;
}