package back.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    private String cuv_rom;
    private String infinitiv;
    
    public int getId(){return id;}
    public void setId(int id){this.id=id;}

    public String getCuvRom(){return cuv_rom;}
    public void setCuvRom(String cuv_rom){this.cuv_rom=cuv_rom;}

    public String getInfinitiv(){return infinitiv;}
    public void setInfinitiv(String infinitiv){this.infinitiv=infinitiv;}

}
