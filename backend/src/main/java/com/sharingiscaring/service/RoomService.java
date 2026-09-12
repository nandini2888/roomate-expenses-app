package com.sharingiscaring.service;

import com.sharingiscaring.dto.RoomDto;
import com.sharingiscaring.dto.RoomMemberDto;
import com.sharingiscaring.model.Room;
import com.sharingiscaring.model.RoomMember;
import com.sharingiscaring.model.User;
import com.sharingiscaring.repository.RoomMemberRepository;
import com.sharingiscaring.repository.RoomRepository;
import com.sharingiscaring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private RoomMemberRepository roomMemberRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public RoomDto createRoom(String name, String description, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Room room = new Room();
        room.setName(name);
        room.setDescription(description);
        room.setCreatedBy(user);
        
        room = roomRepository.save(room);
        
        // Add creator as admin member
        RoomMember member = new RoomMember();
        member.setRoom(room);
        member.setUser(user);
        member.setRole(RoomMember.MemberRole.ADMIN);
        roomMemberRepository.save(member);
        
        return toDto(room);
    }
    
    @Transactional
    public RoomDto joinRoom(String joinCode, Long userId) {
        Room room = roomRepository.findByJoinCode(joinCode)
                .orElseThrow(() -> new RuntimeException("Room not found with join code: " + joinCode));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (roomMemberRepository.existsByRoomIdAndUserId(room.getId(), userId)) {
            throw new RuntimeException("User is already a member of this room");
        }
        
        RoomMember member = new RoomMember();
        member.setRoom(room);
        member.setUser(user);
        member.setRole(RoomMember.MemberRole.MEMBER);
        roomMemberRepository.save(member);
        
        return toDto(room);
    }
    
    public List<RoomDto> getUserRooms(Long userId) {
        List<Room> rooms = roomRepository.findByUserId(userId);
        return rooms.stream().map(this::toDto).collect(Collectors.toList());
    }
    
    public RoomDto getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return toDto(room);
    }
    
    public List<RoomMemberDto> getRoomMembers(Long roomId) {
        List<RoomMember> members = roomMemberRepository.findByRoomId(roomId);
        return members.stream().map(RoomMemberDto::from).collect(Collectors.toList());
    }
    
    @Transactional
    public void removeMember(Long roomId, Long memberId, Long currentUserId) {
        RoomMember member = roomMemberRepository.findByRoomIdAndUserId(roomId, memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        RoomMember currentUserMember = roomMemberRepository.findByRoomIdAndUserId(roomId, currentUserId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this room"));
        
        if (!currentUserMember.getRole().equals(RoomMember.MemberRole.ADMIN) && !memberId.equals(currentUserId)) {
            throw new RuntimeException("Only admins can remove other members");
        }
        
        roomMemberRepository.delete(member);
    }
    
    private RoomDto toDto(Room room) {
        RoomDto dto = new RoomDto();
        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setDescription(room.getDescription());
        dto.setJoinCode(room.getJoinCode());
        dto.setCreatedById(room.getCreatedBy().getId());
        dto.setCreatedByUsername(room.getCreatedBy().getUsername());
        dto.setCreatedAt(room.getCreatedAt());
        dto.setMemberCount(room.getMembers().size());
        dto.setMembers(room.getMembers().stream()
                .map(RoomMemberDto::from)
                .collect(Collectors.toList()));
        return dto;
    }
}



