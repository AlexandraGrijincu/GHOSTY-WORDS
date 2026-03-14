package back.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name ="nivel3_word")
public class nivel4_word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "id_word")
    private Word word;

    @Column(name = "ro_present_continuous")
    private String ro_present_continuous;

    @Column(name="en_prsent_continuous")
    private String en_present_continuous;

    public Word getWord() { return word; }
    public void setIdWord(Word word) { this.word=word; }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getIdWord(){return word.getId();}
    public void setIdWord(int id_word){word.setId(id_word);}

    public String getRo_present_continuous(){return ro_present_continuous;}
    public void setRo_present_continuous(String ro_present_continuous){this.ro_present_continuous=ro_present_continuous;}

    public String getEn_present_continuous(){return en_present_continuous;}
     public void setEn_present_continuous(String en_present_continuous){this.en_present_continuous=en_present_continuous;}

}
