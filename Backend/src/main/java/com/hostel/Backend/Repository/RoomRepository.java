package com.hostel.Backend.Repository;

import com.hostel.Backend.Model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, String> {

    List<Room> findByCapacityGreaterThanEqualAndHasACAndHasAttachedWashroomOrderByCapacityAsc(
            int capacity, boolean hasAC, boolean hasAttachedWashroom
    );
}