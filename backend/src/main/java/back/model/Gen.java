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
@Table(name ="gen")
public class Gen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "id_word")
    private Word word;

    @Column(name = "ro_past_simple")
    private String ro_past_simple;

    @Column(name="en_past_simple")
    private String en_past_simple;

    public Word getWord() { return word; }
    public void setIdWord(Word word) { this.word=word; }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getIdWord(){return word.getId();}
    public void setIdWord(int id_word){word.setId(id_word);}

    public String getRo_past_simple(){return ro_past_simple;}
    public void setRo_past_simple(String ro_past_simple){this.ro_past_simple=ro_past_simple;}

    public String getEn_past_simple(){return en_past_simple;}
     public void setEn_past_simple(String en_past_simple){this.en_past_simple=en_past_simple;}

}
