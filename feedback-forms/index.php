<?php
require_once('tcpdf_include.php'); // ou o caminho para o arquivo TCPDF.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebe os dados do formulário
    $data = $_POST;

    // Cria um novo PDF
    $pdf = new TCPDF();
    $pdf->AddPage();

    // Monta o conteúdo HTML
    $html = '<h1>Feedbacks sobre o MVP do projeto - Descarte de Lixo Eletrônico</h1><ul>';
    foreach ($data as $key => $value) {
        $html .= '<li><b>' . htmlspecialchars($key) . ':</b> ' . htmlspecialchars($value) . '</li>';
    }
    $html .= '</ul>';

    // Escreve o HTML no PDF
    $pdf->writeHTML($html, true, false, true, false, '');

    // Gera o PDF para download
    $pdf->Output('feedback_mvp.pdf', 'D');

    // Opcional: enviar dados para Formspree via cURL
    $ch = curl_init('https://formspree.io/f/mwpnqweb');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    exit;
}
?>
