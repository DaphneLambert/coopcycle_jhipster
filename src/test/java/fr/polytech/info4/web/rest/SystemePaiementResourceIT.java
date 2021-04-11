package fr.polytech.info4.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.polytech.info4.IntegrationTest;
import fr.polytech.info4.domain.SystemePaiement;
import fr.polytech.info4.repository.SystemePaiementRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SystemePaiementResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class SystemePaiementResourceIT {

    private static final String DEFAULT_METHOD = "AAAAAAAAAA";
    private static final String UPDATED_METHOD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/systeme-paiements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SystemePaiementRepository systemePaiementRepository;

    @Mock
    private SystemePaiementRepository systemePaiementRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSystemePaiementMockMvc;

    private SystemePaiement systemePaiement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SystemePaiement createEntity(EntityManager em) {
        SystemePaiement systemePaiement = new SystemePaiement().method(DEFAULT_METHOD);
        return systemePaiement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SystemePaiement createUpdatedEntity(EntityManager em) {
        SystemePaiement systemePaiement = new SystemePaiement().method(UPDATED_METHOD);
        return systemePaiement;
    }

    @BeforeEach
    public void initTest() {
        systemePaiement = createEntity(em);
    }

    @Test
    @Transactional
    void createSystemePaiement() throws Exception {
        int databaseSizeBeforeCreate = systemePaiementRepository.findAll().size();
        // Create the SystemePaiement
        restSystemePaiementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(systemePaiement))
            )
            .andExpect(status().isCreated());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeCreate + 1);
        SystemePaiement testSystemePaiement = systemePaiementList.get(systemePaiementList.size() - 1);
        assertThat(testSystemePaiement.getMethod()).isEqualTo(DEFAULT_METHOD);
    }

    @Test
    @Transactional
    void createSystemePaiementWithExistingId() throws Exception {
        // Create the SystemePaiement with an existing ID
        systemePaiement.setId(1L);

        int databaseSizeBeforeCreate = systemePaiementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSystemePaiementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(systemePaiement))
            )
            .andExpect(status().isBadRequest());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkMethodIsRequired() throws Exception {
        int databaseSizeBeforeTest = systemePaiementRepository.findAll().size();
        // set the field null
        systemePaiement.setMethod(null);

        // Create the SystemePaiement, which fails.

        restSystemePaiementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(systemePaiement))
            )
            .andExpect(status().isBadRequest());

        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSystemePaiements() throws Exception {
        // Initialize the database
        systemePaiementRepository.saveAndFlush(systemePaiement);

        // Get all the systemePaiementList
        restSystemePaiementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(systemePaiement.getId().intValue())))
            .andExpect(jsonPath("$.[*].method").value(hasItem(DEFAULT_METHOD)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSystemePaiementsWithEagerRelationshipsIsEnabled() throws Exception {
        when(systemePaiementRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSystemePaiementMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(systemePaiementRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSystemePaiementsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(systemePaiementRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSystemePaiementMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(systemePaiementRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getSystemePaiement() throws Exception {
        // Initialize the database
        systemePaiementRepository.saveAndFlush(systemePaiement);

        // Get the systemePaiement
        restSystemePaiementMockMvc
            .perform(get(ENTITY_API_URL_ID, systemePaiement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(systemePaiement.getId().intValue()))
            .andExpect(jsonPath("$.method").value(DEFAULT_METHOD));
    }

    @Test
    @Transactional
    void getNonExistingSystemePaiement() throws Exception {
        // Get the systemePaiement
        restSystemePaiementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSystemePaiement() throws Exception {
        // Initialize the database
        systemePaiementRepository.saveAndFlush(systemePaiement);

        int databaseSizeBeforeUpdate = systemePaiementRepository.findAll().size();

        // Update the systemePaiement
        SystemePaiement updatedSystemePaiement = systemePaiementRepository.findById(systemePaiement.getId()).get();
        // Disconnect from session so that the updates on updatedSystemePaiement are not directly saved in db
        em.detach(updatedSystemePaiement);
        updatedSystemePaiement.method(UPDATED_METHOD);

        restSystemePaiementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSystemePaiement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSystemePaiement))
            )
            .andExpect(status().isOk());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeUpdate);
        SystemePaiement testSystemePaiement = systemePaiementList.get(systemePaiementList.size() - 1);
        assertThat(testSystemePaiement.getMethod()).isEqualTo(UPDATED_METHOD);
    }

    @Test
    @Transactional
    void putNonExistingSystemePaiement() throws Exception {
        int databaseSizeBeforeUpdate = systemePaiementRepository.findAll().size();
        systemePaiement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSystemePaiementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, systemePaiement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(systemePaiement))
            )
            .andExpect(status().isBadRequest());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSystemePaiement() throws Exception {
        int databaseSizeBeforeUpdate = systemePaiementRepository.findAll().size();
        systemePaiement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSystemePaiementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(systemePaiement))
            )
            .andExpect(status().isBadRequest());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSystemePaiement() throws Exception {
        int databaseSizeBeforeUpdate = systemePaiementRepository.findAll().size();
        systemePaiement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSystemePaiementMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(systemePaiement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSystemePaiementWithPatch() throws Exception {
        // Initialize the database
        systemePaiementRepository.saveAndFlush(systemePaiement);

        int databaseSizeBeforeUpdate = systemePaiementRepository.findAll().size();

        // Update the systemePaiement using partial update
        SystemePaiement partialUpdatedSystemePaiement = new SystemePaiement();
        partialUpdatedSystemePaiement.setId(systemePaiement.getId());

        partialUpdatedSystemePaiement.method(UPDATED_METHOD);

        restSystemePaiementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSystemePaiement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSystemePaiement))
            )
            .andExpect(status().isOk());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeUpdate);
        SystemePaiement testSystemePaiement = systemePaiementList.get(systemePaiementList.size() - 1);
        assertThat(testSystemePaiement.getMethod()).isEqualTo(UPDATED_METHOD);
    }

    @Test
    @Transactional
    void fullUpdateSystemePaiementWithPatch() throws Exception {
        // Initialize the database
        systemePaiementRepository.saveAndFlush(systemePaiement);

        int databaseSizeBeforeUpdate = systemePaiementRepository.findAll().size();

        // Update the systemePaiement using partial update
        SystemePaiement partialUpdatedSystemePaiement = new SystemePaiement();
        partialUpdatedSystemePaiement.setId(systemePaiement.getId());

        partialUpdatedSystemePaiement.method(UPDATED_METHOD);

        restSystemePaiementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSystemePaiement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSystemePaiement))
            )
            .andExpect(status().isOk());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeUpdate);
        SystemePaiement testSystemePaiement = systemePaiementList.get(systemePaiementList.size() - 1);
        assertThat(testSystemePaiement.getMethod()).isEqualTo(UPDATED_METHOD);
    }

    @Test
    @Transactional
    void patchNonExistingSystemePaiement() throws Exception {
        int databaseSizeBeforeUpdate = systemePaiementRepository.findAll().size();
        systemePaiement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSystemePaiementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, systemePaiement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(systemePaiement))
            )
            .andExpect(status().isBadRequest());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSystemePaiement() throws Exception {
        int databaseSizeBeforeUpdate = systemePaiementRepository.findAll().size();
        systemePaiement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSystemePaiementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(systemePaiement))
            )
            .andExpect(status().isBadRequest());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSystemePaiement() throws Exception {
        int databaseSizeBeforeUpdate = systemePaiementRepository.findAll().size();
        systemePaiement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSystemePaiementMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(systemePaiement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SystemePaiement in the database
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSystemePaiement() throws Exception {
        // Initialize the database
        systemePaiementRepository.saveAndFlush(systemePaiement);

        int databaseSizeBeforeDelete = systemePaiementRepository.findAll().size();

        // Delete the systemePaiement
        restSystemePaiementMockMvc
            .perform(delete(ENTITY_API_URL_ID, systemePaiement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SystemePaiement> systemePaiementList = systemePaiementRepository.findAll();
        assertThat(systemePaiementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
