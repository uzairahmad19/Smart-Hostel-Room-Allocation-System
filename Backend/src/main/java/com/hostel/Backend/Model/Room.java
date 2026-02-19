package com.hostel.Backend.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    private String roomNo;
    private int capacity;
    private boolean hasAC;
    private boolean hasAttachedWashroom;
}
