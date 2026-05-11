package com.hooppath.domain.course.dto;

import com.hooppath.domain.instructor.entity.Instructor;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InstructorResponse {
    private Long id;
    private String nickname;
    private String bio;
    private String career;

    public static InstructorResponse from(Instructor instructor) {
        if (instructor == null) {
            return null;
        }
        return new InstructorResponse(
                instructor.getId(),
                instructor.getUser() != null ? instructor.getUser().getNickname() : null,
                instructor.getBio(),
                instructor.getCareer()
        );
    }
}
