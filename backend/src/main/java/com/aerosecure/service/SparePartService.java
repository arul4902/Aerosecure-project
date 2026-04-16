package com.aerosecure.service;

import com.aerosecure.dto.request.SparePartRequest;
import com.aerosecure.entity.SparePart;
import com.aerosecure.enums.PartStatus;
import com.aerosecure.exception.ResourceNotFoundException;
import com.aerosecure.repository.SparePartRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SparePartService {

    private final SparePartRepository sparePartRepository;

    public SparePartService(SparePartRepository sparePartRepository) {
        this.sparePartRepository = sparePartRepository;
    }

    public Page<SparePart> getAllParts(String search, String status, Pageable pageable) {
        PartStatus partStatus = null;
        if (status != null && !status.isEmpty()) {
            partStatus = PartStatus.valueOf(status.toUpperCase());
        }
        return sparePartRepository.findWithFilters(search, partStatus, pageable);
    }

    public SparePart getPartById(Long id) {
        return sparePartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spare Part", id));
    }

    public SparePart createPart(SparePartRequest request) {
        SparePart part = new SparePart();
        mapRequestToEntity(request, part);
        updateStockStatus(part);
        return sparePartRepository.save(part);
    }

    public SparePart updatePart(Long id, SparePartRequest request) {
        SparePart part = getPartById(id);
        mapRequestToEntity(request, part);
        updateStockStatus(part);
        return sparePartRepository.save(part);
    }

    public void deletePart(Long id) {
        SparePart part = getPartById(id);
        sparePartRepository.delete(part);
    }

    public List<SparePart> getLowStockParts() {
        return sparePartRepository.findLowStockParts();
    }

    public SparePart simulateProcurement(Long id, int quantity) {
        SparePart part = getPartById(id);
        part.setQuantity(part.getQuantity() + quantity);
        part.setLastOrdered(LocalDateTime.now());
        updateStockStatus(part);
        return sparePartRepository.save(part);
    }

    public long countByStatus(PartStatus status) {
        return sparePartRepository.countByStatus(status);
    }

    public long countTotal() {
        return sparePartRepository.count();
    }

    private void updateStockStatus(SparePart part) {
        if (part.getQuantity() <= 0) {
            part.setStatus(PartStatus.OUT_OF_STOCK);
        } else if (part.getQuantity() <= part.getMinStockLevel()) {
            part.setStatus(PartStatus.LOW_STOCK);
        } else {
            part.setStatus(PartStatus.IN_STOCK);
        }
    }

    private void mapRequestToEntity(SparePartRequest request, SparePart part) {
        part.setPartId(request.getPartId());
        part.setName(request.getName());
        part.setCategory(request.getCategory());
        part.setQuantity(request.getQuantity());
        if (request.getMinStockLevel() != null) {
            part.setMinStockLevel(request.getMinStockLevel());
        }
        part.setSupplier(request.getSupplier());
        part.setUnitPrice(request.getUnitPrice());
        part.setCompatibleAircraft(request.getCompatibleAircraft());
    }
}
