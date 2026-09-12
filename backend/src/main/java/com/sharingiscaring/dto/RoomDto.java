package com.sharingiscaring.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RoomDto {
    private Long id;
    private String name;
    private String description;
    private String joinCode;
    private Long createdById;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private List<RoomMemberDto> members;
    private Integer memberCount;
}



