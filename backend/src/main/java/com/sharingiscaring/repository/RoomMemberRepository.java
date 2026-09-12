package com.sharingiscaring.repository;

import com.sharingiscaring.model.RoomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
    Optional<RoomMember> findByRoomIdAndUserId(Long roomId, Long userId);
    
    List<RoomMember> findByRoomId(Long roomId);
    
    List<RoomMember> findByUserId(Long userId);
    
    @Query("SELECT COUNT(rm) FROM RoomMember rm WHERE rm.room.id = :roomId")
    Integer countByRoomId(@Param("roomId") Long roomId);
    
    boolean existsByRoomIdAndUserId(Long roomId, Long userId);
}



