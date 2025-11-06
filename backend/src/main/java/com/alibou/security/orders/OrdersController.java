package com.alibou.security.orders;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
public class OrdersController {

    private final OrdersRepository ordersRepository;
    private final OrdersService ordersService;

    public OrdersController(OrdersRepository ordersRepository, OrdersService ordersService) {
        this.ordersRepository = ordersRepository;
        this.ordersService = ordersService;
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            ordersService.deleteOrder(id);
            return ResponseEntity.ok().body(
                    Map.of("success", true, "message", "Order deleted successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false, "error", e.getMessage())
            );
        }
    }

    @PostMapping
    public ResponseEntity<OrdersResponse> createOrder(@RequestBody OrdersRequest request) {
        try {
            Orders savedOrder = ordersService.createOrder(request);
            OrdersResponse response = new OrdersResponse(savedOrder);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdersResponse> getOrderById(@PathVariable Long id) {
        Optional<Orders> order = ordersService.getOrderById(id);
        return order.map(o -> ResponseEntity.ok(new OrdersResponse(o)))
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping
    public List<OrdersResponse> getAllOrders() {
        return ordersService.getAllOrders().stream()
                .map(OrdersResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Long userId) {
        try {
            List<Orders> orders = ordersService.getOrdersByUserId(userId);

            List<OrdersResponse> response = orders.stream()
                    .map(OrdersResponse::new) // Используем конструктор с Orders
                    .toList();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка при получении заказов пользователя: " + e.getMessage());
        }
    }
    private OrdersResponse convertToResponse(Orders order) {
        return OrdersResponse.builder()
                .id(order.getId())
                .name(order.getName())
                .customer(order.getCustomer())
                .quest(order.getQuest())
                .status(order.getStatus())
                .managerName(String.valueOf(order.getEmployee())) // или другой способ получения менеджера
                .build();
    }
    @GetMapping("/{id}/pdf-download")
    public ResponseEntity<InputStreamResource> downloadOrderPdf(@PathVariable Long id) {
        try {
            System.out.println("Starting PDF generation for order: " + id);

            Optional<Orders> orderOpt = ordersService.getOrderById(id);
            if (orderOpt.isEmpty()) {
                System.out.println("Order not found: " + id);
                return ResponseEntity.notFound().build();
            }

            Orders order = orderOpt.get();
            System.out.println("Order found: " + order.getId() + ", generating PDF...");

            byte[] pdfBytes = generatePdfForOrder(order);

            System.out.println("PDF generated successfully, size: " + pdfBytes.length + " bytes");

            ByteArrayInputStream bis = new ByteArrayInputStream(pdfBytes);
            InputStreamResource resource = new InputStreamResource(bis);

            String filename = "order_" + order.getId() + ".pdf";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .contentLength(pdfBytes.length)
                    .body(resource);

        } catch (Exception e) {
            System.err.println("ERROR in PDF download: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    private byte[] generatePdfForOrder(Orders order) {
        try {
            ByteArrayOutputStream outStream = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter writer = PdfWriter.getInstance(document, outStream);
            document.open();

            // Создаем шрифт Times New Roman для русского текста
            Font timesNewRoman = createTimesNewRomanFont(12, Font.NORMAL);
            Font timesNewRomanBold = createTimesNewRomanFont(14, Font.BOLD);

            // Добавляем контент с русским текстом
            document.add(new Paragraph("Детали заказа", timesNewRomanBold));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("ID заказа: " + order.getId(), timesNewRoman));
            document.add(new Paragraph("Название: " + safeString(order.getName()), timesNewRoman));
            document.add(new Paragraph("Клиент: " + safeString(order.getCustomer()), timesNewRoman));
            document.add(new Paragraph("Задача: " + safeString(order.getQuest()), timesNewRoman));
            document.add(new Paragraph("Статус: " + safeString(order.getStatus()), timesNewRoman));
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Дата генерации: " + new java.util.Date(), timesNewRoman));

            document.close();
            return outStream.toByteArray();

        } catch (Exception e) {
            System.err.println("Error in generatePdfForOrder: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("PDF generation failed", e);
        }
    }

    private Font createTimesNewRomanFont(int size, int style) {
        try {
            // Попробуйте найти Times New Roman в разных местах
            String[] fontPaths = {
                    "/templates/times.ttf",
                    "/templates/timesbd.ttf",
                    "/fonts/times.ttf",
                    "src/main/resources/templates/times.ttf",
                    "C:/Windows/Fonts/times.ttf", // Windows системный путь
                    "/usr/share/fonts/truetype/msttcorefonts/Times_New_Roman.ttf" // Linux путь
            };

            for (String fontPath : fontPaths) {
                try {
                    // Сначала попробуем из ресурсов
                    InputStream fontStream = getClass().getClassLoader().getResourceAsStream(fontPath);
                    if (fontStream != null) {
                        File tempFont = File.createTempFile("times", ".ttf");
                        try (FileOutputStream out = new FileOutputStream(tempFont)) {
                            fontStream.transferTo(out);
                        }
                        BaseFont baseFont = BaseFont.createFont(tempFont.getAbsolutePath(), BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                        return new Font(baseFont, size, style);
                    }

                    // Попробуем прямо из файловой системы
                    File fontFile = new File(fontPath);
                    if (fontFile.exists()) {
                        BaseFont baseFont = BaseFont.createFont(fontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                        return new Font(baseFont, size, style);
                    }
                } catch (Exception e) {
                    System.err.println("Failed to load Times New Roman from " + fontPath);
                }
            }

            // Фолбэк на Helvetica если Times New Roman не найден
            System.out.println("Times New Roman not found, using Helvetica");
            BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, BaseFont.EMBEDDED);
            return new Font(baseFont, size, style);

        } catch (Exception e) {
            System.err.println("Error creating Times New Roman font: " + e.getMessage());
            // Последний фолбэк
            return new Font(Font.FontFamily.HELVETICA, size, style);
        }
    }

    private String safeString(String value) {
        return value != null ? value : "";
    }
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrdersRequest request) {
        try {
            if (request.getStatus() == null) {
                return ResponseEntity.badRequest()
                        .body("Status field is required");
            }

            Orders updatedOrder = ordersService.updateOrderStatus(orderId, request.getStatus());

            // Используем конструктор с Orders
            OrdersResponse response = new OrdersResponse(updatedOrder);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка при обновлении статуса заказа: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Внутренняя ошибка сервера");
        }
    }

}
