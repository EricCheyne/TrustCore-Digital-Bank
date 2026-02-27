package com.trustcore.audit;

import com.trustcore.audit.model.AuditLog;
import com.trustcore.audit.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@SpringBootApplication
@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditServiceApplication {

    private final AuditRepository auditRepository;

    public static void main(String[] args) {
        SpringApplication.run(AuditServiceApplication.class, args);
    }

    @PostMapping("/logs")
    public AuditLog createLog(@RequestBody AuditLog log) {
        if (log.getTimestamp() == null) {
            log.setTimestamp(LocalDateTime.now());
        }
        return auditRepository.save(log);
    }

    @GetMapping("/logs")
    public List<AuditLog> getAllLogs() {
        return auditRepository.findAllByOrderByTimestampDesc();
    }

    @GetMapping("/logs/user/{username}")
    public List<AuditLog> getLogsByUser(@PathVariable String username) {
        return auditRepository.findByUsernameOrderByTimestampDesc(username);
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "audit-service");
    }
}
