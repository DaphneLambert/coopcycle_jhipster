package fr.polytech.info4.repository;

import fr.polytech.info4.domain.SystemePaiement;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SystemePaiement entity.
 */
@Repository
public interface SystemePaiementRepository extends JpaRepository<SystemePaiement, Long> {
    @Query(
        value = "select distinct systemePaiement from SystemePaiement systemePaiement left join fetch systemePaiement.agents",
        countQuery = "select count(distinct systemePaiement) from SystemePaiement systemePaiement"
    )
    Page<SystemePaiement> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct systemePaiement from SystemePaiement systemePaiement left join fetch systemePaiement.agents")
    List<SystemePaiement> findAllWithEagerRelationships();

    @Query(
        "select systemePaiement from SystemePaiement systemePaiement left join fetch systemePaiement.agents where systemePaiement.id =:id"
    )
    Optional<SystemePaiement> findOneWithEagerRelationships(@Param("id") Long id);
}
