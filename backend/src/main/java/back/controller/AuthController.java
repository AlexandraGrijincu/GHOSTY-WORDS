package back.controller;
import java.time.LocalDate;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import back.model.Users;
import back.model.Word;
import back.repository.UserRepository;
import back.repository.WordRepository;
import dto.LoginRequest;
import dto.LoginResponse;

@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WordRepository wordRepository;
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Users user = userRepository.findByEmail(request.getEmail());
        if(user == null){
            return new LoginResponse(false, "Email not found",0);
        }
        if(!user.getParola().equals(request.getParola())){
            return new LoginResponse(false, "Wrong password",0);
        }
        return new LoginResponse(true, "Login succesful",user.getId());
    }
    @PostMapping("/register")
    public LoginResponse register(@RequestBody LoginRequest request) {
            if(userRepository.findByEmail(request.getEmail())!=null){
                return new LoginResponse(false, "Email deja inregistrat",0);
            }
            Pattern pattern = Pattern.compile("[a-zA-Z0-9.-_]+@[a-z].[a-z]{2,4}", Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(request.getEmail());
            boolean matchFound = matcher.find();
            if(!matchFound)
            {
                return new LoginResponse(false, "Trebuie sa fie email",0);
            }
            Users newUser = new Users();
            newUser.setEmail(request.getEmail());
            newUser.setParola(request.getParola());
            userRepository.save(newUser);
            return new LoginResponse(true, "Inregistrare reusita",0);
    }
    @GetMapping("/getWordsall")
    public List<Word> getWordsall() {
        return wordRepository.findAll();
    }
    
    
}
