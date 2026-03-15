package back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import back.model.nivel4_word; 

@Repository
public interface Nivel4Repository extends JpaRepository<nivel4_word, Integer> {
}