package com.sharingiscaring.dto;

import com.sharingiscaring.model.RoomMember;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RoomMemberDto {
    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private RoomMember.MemberRole role;
    private LocalDateTime joinedAt;
    
    public static RoomMemberDto from(RoomMember member) {
        RoomMemberDto dto = new RoomMemberDto();
        dto.setId(member.getId());
        dto.setUserId(member.getUser().getId());
        dto.setUsername(member.getUser().getUsername());
        dto.setFullName(member.getUser().getFullName());
        dto.setEmail(member.getUser().getEmail());
        dto.setRole(member.getRole());
        dto.setJoinedAt(member.getJoinedAt());
        return dto;
    }
}



