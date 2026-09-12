package com.sharingiscaring.controller;

import com.sharingiscaring.dto.RoomDto;
import com.sharingiscaring.dto.RoomMemberDto;
import com.sharingiscaring.security.UserPrincipal;
import com.sharingiscaring.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {
    
    @Autowired
    private RoomService roomService;
    
    @PostMapping
    public ResponseEntity<RoomDto> createRoom(@Valid @RequestBody Map<String, String> request, Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        RoomDto room = roomService.createRoom(
                request.get("name"),
                request.get("description"),
                userId
        );
        return ResponseEntity.ok(room);
    }
    
    @PostMapping("/join")
    public ResponseEntity<RoomDto> joinRoom(@RequestBody Map<String, String> request, Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        RoomDto room = roomService.joinRoom(request.get("joinCode"), userId);
        return ResponseEntity.ok(room);
    }
    
    @GetMapping
    public ResponseEntity<List<RoomDto>> getUserRooms(Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        List<RoomDto> rooms = roomService.getUserRooms(userId);
        return ResponseEntity.ok(rooms);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> getRoom(@PathVariable Long id) {
        RoomDto room = roomService.getRoomById(id);
        return ResponseEntity.ok(room);
    }
    
    @GetMapping("/{id}/members")
    public ResponseEntity<List<RoomMemberDto>> getRoomMembers(@PathVariable Long id) {
        List<RoomMemberDto> members = roomService.getRoomMembers(id);
        return ResponseEntity.ok(members);
    }
    
    @DeleteMapping("/{roomId}/members/{memberId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long roomId, 
                                            @PathVariable Long memberId,
                                            Authentication authentication) {
        Long currentUserId = ((UserPrincipal) authentication.getPrincipal()).getId();
        roomService.removeMember(roomId, memberId, currentUserId);
        return ResponseEntity.noContent().build();
    }
}

