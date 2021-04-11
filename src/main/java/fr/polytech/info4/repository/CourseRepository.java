package fr.polytech.info4.repository;

import fr.polytech.info4.domain.Course;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Course entity.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    @Query(
        value = "select distinct course from Course course left join fetch course.agents",
        countQuery = "select count(distinct course) from Course course"
    )
    Page<Course> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct course from Course course left join fetch course.agents")
    List<Course> findAllWithEagerRelationships();

    @Query("select course from Course course left join fetch course.agents where course.id =:id")
    Optional<Course> findOneWithEagerRelationships(@Param("id") String id);
}
