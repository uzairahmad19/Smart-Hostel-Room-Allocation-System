package com.hostel.Backend.Controller;

import com.hostel.Backend.Model.Room;
import com.hostel.Backend.Repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    // Add Room
    @PostMapping
    public ResponseEntity<?> addRoom(@RequestBody Room room) {
        // Check if the room number already exists
        if (roomRepository.existsById(room.getRoomNo())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Collections.singletonMap("error", "Room already added"));
        }

        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    // View All Rooms
    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Search Rooms
    @GetMapping("/search")
    public List<Room> searchRooms(
            @RequestParam int capacity,
            @RequestParam boolean hasAC,
            @RequestParam boolean hasAttachedWashroom) {
        return roomRepository.findByCapacityGreaterThanEqualAndHasACAndHasAttachedWashroomOrderByCapacityAsc(
                capacity, hasAC, hasAttachedWashroom);
    }

    // Allocate Room
    @GetMapping("/allocate")
    public ResponseEntity<?> allocateRoom(
            @RequestParam int students,
            @RequestParam boolean needsAC,
            @RequestParam boolean needsWashroom) {

        List<Room> suitableRooms = roomRepository.findByCapacityGreaterThanEqualAndHasACAndHasAttachedWashroomOrderByCapacityAsc(
                students, needsAC, needsWashroom);

        // If no suitable room exists
        if (suitableRooms.isEmpty()) {
            return ResponseEntity.ok(Collections.singletonMap("message", "No room available"));
        }

        // Return the first room in the list
        return ResponseEntity.ok(suitableRooms.get(0));
    }
}
