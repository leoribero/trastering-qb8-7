// Variable global para almacenar pricesC1
let pricesC1 = [];

// Función principal que maneja el fetch y el procesamiento de datos
async function initializePricesC1() {
    try {
                
        const response = await fetch("/scripts/data.json");
        const trKing = await response.json();

        // Verificar que trKing[0] existe y tiene las propiedades necesarias
        if (!trKing || !trKing[0] || !trKing[0].numBoutique || !trKing[0].disponibilites) {
            console.error('Datos no válidos en el JSON:', trKing);
            return;
        }

        // console.log("trKing.length", trKing.length);
        // console.log("trKing[0].disponibilites.length", trKing[0].disponibilites.length);
        const tamanos_disponibles = trKing[0].disponibilites.length;
        console.log("tamanos_disponibles", tamanos_disponibles);
        
        // Actualizar dinámicamente el texto del h2 con id "tamanos_disp"
        updateTamanosDispText(tamanos_disponibles);
        
        if (trKing[0].numBoutique == 1) {
            const cen_1_map = {};
            const cen_1 = [];

            trKing[0].disponibilites.forEach(data => {
                
                // Determinar planta
                let planta = data.sizeCodeId.includes("P1") ? "P1" : "P0";
                // Determinar tipo
                let tipo = "";
                if (data.sizeCodeId.includes("Pequeno")) tipo = "A";
                else if (data.sizeCodeId.includes("Mediano")) tipo = "B";
                else if (data.sizeCodeId.includes("Grande")) tipo = "C";
                else if (data.sizeCodeId.includes("Maxi")) tipo = "D";
                // Determinar número
                let num = planta === "P0" ? "1A" : "2A";
                // Determinar sufijo tamaño
                let sufijo = "";
                if (data.sizeCodeId.includes("Pequeno")) sufijo = "sms";
                else if (data.sizeCodeId.includes("Mediano")) sufijo = "med";
                else if (data.sizeCodeId.includes("Grande")) sufijo = "gra";
                else if (data.sizeCodeId.includes("Maxi")) sufijo = "max";
                // Construir nombre
                let productName = `${tipo}${num}_cen_1_${planta}_${sufijo}_men`;

                // Solo añadir si no existe aún
                if (!cen_1_map[productName]) {
                    // Llama a processProduct y añade el producto
                    const product = processProduct([data], [], planta, productName);
                    cen_1_map[productName] = product;
                }
            });

            // El array final:
            for (const key in cen_1_map) {
                if (cen_1_map[key]) cen_1.push(cen_1_map[key]);
            }

            pricesC1 = cen_1;
            window.pricesC1 = pricesC1;
            window.dispatchEvent(new CustomEvent('pricesC1Ready'));
            // Nuevo evento unificado para multi-centro
            window.dispatchEvent(new CustomEvent('pricesReady', { detail: { centro: 1, data: pricesC1 } }));
            console.log("pricesC1 cargado:", pricesC1);
        } else {
            console.error('No se encontró la boutique 1 en los datos');
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Función auxiliar para procesar cada producto
function processProduct(productData, cen_1, floor, productName) {
    if (productData && productData.length > 0) {
        const data = productData[0];
        const name_cen_1 = data.nom;
        const numArticle = data.numArticle;
        const numFormat = data.numFormat;
        const sizeCodeId = data.sizeCodeId;
        const price_no_discount = data.tarifs[0].montantReference;
        const payment_frequency = data.tarifs[0].prixBarreSoustitre;
        const price_tachado = data.tarifs[0].montantReference * 12;
        const price_tachado_y = data.tarifs[2].montantReference;
        const plan_num_ref = data.tarifs[0].numDuree;
        const price_with_discount = data.tarifs[0].montant;

        let promo_mode = null;
        let promo_duration = null;
        let discount = null;
        let sufix_discount = null;
        let VA1_monto_ahorro = null;

        if (data.tarifs[0].typePromo) {
            promo_mode = data.tarifs[0].promoMode;
            promo_duration = data.tarifs[0].promoTempDuree;
            discount = data.tarifs[0].promoTempValeur;
            sufix_discount = promo_mode === "pourcentage" ? "%" : "€";
            VA1_monto_ahorro = promo_mode === "pourcentage" 
                ? data.tarifs[0].promoTempValeur 
                : data.tarifs[0].promoTempValeur * data.tarifs[0].promoTempDuree;
        }

        const product = {
            AA0_name_cen: name_cen_1,
            AA1_product_name: productName,
            CA0_numArticle: numArticle,
            DA0_numFormat: numFormat,
            EA0_sizeCodeId: sizeCodeId,
            JA0_price_no_discount: price_no_discount,
            JA1_price_no_discount_no_vat: Math.round(price_no_discount / 1.21),
            KA0_promo_mode: promo_mode,
            LA0_promo_duration: promo_duration,
            MA0_discount: discount,
            NA0_plan_num_ref: plan_num_ref,
            OA0_price_with_discount: price_with_discount,
            OA1_price_with_discount_no_vat: Math.round(price_with_discount / 1.21),
            OA9_price_anual: price_tachado_y,
            PA0_sufix_discount: sufix_discount,
            QA0_size_to_order_or_sort: floor === "P0" ? 100 : 110,
            RA0_floor: floor === "P0" ? 0 : 1,
            SA0_nbDispo: data.nbDispo,
            TA0_price_tachado: price_tachado,
            UA0_price_tachado_no_vat: Math.round(price_tachado / 1.21),
            VA0_monto_ahorro: price_tachado - price_tachado_y,
            VA1_monto_ahorro: VA1_monto_ahorro,
            WA0_monto_ahorro_no_vat: Math.round((price_tachado - price_tachado_y) / 1.21),
            WA1_monto_ahorro_no_vat: VA1_monto_ahorro ? Math.round(VA1_monto_ahorro / 1.21) : null,
            XA0_payment_frequency: payment_frequency
        };

        return product;
    }
    return null;
}

// Iniciar el proceso
initializePricesC1();

// Función para actualizar dinámicamente el texto del h2 con id "tamanos_disp"
function updateTamanosDispText(tamanos_disponibles) {
    const tamanosDispElement = document.getElementById('tamanos_disp');
    
    if (tamanosDispElement) {
        let newText;
        if (tamanos_disponibles > 1) {
            newText = `${tamanos_disponibles} tamaños de trasteros disponibles: elige el tuyo`;
        } else {
            newText = `${tamanos_disponibles} tamaño de trastero disponible`;
        }
        
        tamanosDispElement.textContent = newText;
        console.log('Texto del h2 actualizado:', newText);
    } else {
        console.warn('Elemento con id "tamanos_disp" no encontrado');
    }
}

// Exportar la variable para que pueda ser importada

