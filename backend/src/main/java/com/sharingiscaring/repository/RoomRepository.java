package com.sharingiscaring.repository;

import com.sharingiscaring.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByJoinCode(String joinCode);
    
    @Query("SELECT r FROM Room r JOIN r.members m WHERE m.user.id = :userId")
    List<Room> findByUserId(@Param("userId") Long userId);
}



