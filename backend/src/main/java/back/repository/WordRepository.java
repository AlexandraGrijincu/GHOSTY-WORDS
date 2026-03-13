package back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import back.model.Word;

@Repository
public interface WordRepository extends JpaRepository<Word,Integer>{
    
}
