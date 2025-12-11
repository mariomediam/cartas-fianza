-- Función para obtener el reporte de cartas fianza por contratista
-- Esta función considera si el último estado está activo para decidir qué datos mostrar

DROP FUNCTION IF EXISTS get_warranty_by_contractor(INTEGER);

CREATE OR REPLACE FUNCTION get_warranty_by_contractor(p_contractor_id INTEGER)
RETURNS TABLE (
    warranty_histories_id BIGINT,
    letter_number VARCHAR,
    issue_date DATE,
    validity_start DATE,
    validity_end DATE,
    amount NUMERIC,
    currency_type_id BIGINT,
    financial_entity_id BIGINT,
    warranty_id BIGINT,
    contractor_id BIGINT,
    letter_type_id BIGINT,
    warranty_object_id BIGINT,
    symbol VARCHAR,
    financial_entities_description VARCHAR,
    business_name VARCHAR,
    ruc VARCHAR,
    letter_types_description VARCHAR,
    warranty_objects_description VARCHAR,
    cui VARCHAR,
    warranty_statuses_last_description VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT  
        warranty_histories_last.id as warranty_histories_id,
        CASE
            WHEN warranty_statuses_last.is_active = true THEN warranty_histories_last.letter_number
            ELSE warranty_histories_penultimate.letter_number
        END as letter_number,
        warranty_histories_last.issue_date,
        CASE
            WHEN warranty_statuses_last.is_active = true THEN warranty_histories_last.validity_start
            ELSE warranty_histories_penultimate.validity_start
        END as validity_start,
        CASE
            WHEN warranty_statuses_last.is_active = true THEN warranty_histories_last.validity_end
            ELSE warranty_histories_penultimate.validity_end
        END as validity_end,
        CASE
            WHEN warranty_statuses_last.is_active = true THEN warranty_histories_last.amount
            ELSE warranty_histories_penultimate.amount
        END as amount,
        CASE
            WHEN warranty_statuses_last.is_active = true THEN warranty_histories_last.currency_type_id
            ELSE warranty_histories_penultimate.currency_type_id
        END as currency_type_id,
        CASE
            WHEN warranty_statuses_last.is_active = true THEN warranty_histories_last.financial_entity_id
            ELSE warranty_histories_penultimate.financial_entity_id
        END as financial_entity_id,
        warranty_histories_last.warranty_id,
        warranties.contractor_id,
        warranties.letter_type_id,
        warranties.warranty_object_id,
        CASE
            WHEN warranty_statuses_last.is_active = true THEN currency_types_last.symbol
            ELSE currency_types_penultimate.symbol
        END as symbol,
        CASE
            WHEN warranty_statuses_last.is_active = true THEN financial_entities_last.description
            ELSE financial_entities_penultimate.description
        END as financial_entities_description,
        contractors.business_name,
        contractors.ruc,
        letter_types.description as letter_types_description,
        warranty_objects.description as warranty_objects_description,
        warranty_objects.cui,
        warranty_statuses_last.description as warranty_statuses_last_description
    FROM (
        SELECT 
            THistoriesLast.warranty_id, 
            THistoriesLast.warranty_histories_id_last,
            MAX(wh.id) as warranty_histories_id_penultimate
        FROM (
            SELECT 
                wh2.warranty_id,
                MAX(wh2.id) as warranty_histories_id_last
            FROM (
                SELECT w.id as warranty_id
                FROM warranties w
                WHERE w.contractor_id = p_contractor_id
            ) as TWarranties
            INNER JOIN warranty_histories wh2
                ON TWarranties.warranty_id = wh2.warranty_id
            GROUP BY wh2.warranty_id
        ) as THistoriesLast
        LEFT JOIN warranty_histories wh
            ON THistoriesLast.warranty_id = wh.warranty_id
            AND wh.id < THistoriesLast.warranty_histories_id_last
        GROUP BY THistoriesLast.warranty_id, THistoriesLast.warranty_histories_id_last
    ) TReport
    LEFT JOIN warranty_histories as warranty_histories_last
        ON TReport.warranty_histories_id_last = warranty_histories_last.id
    LEFT JOIN warranty_histories as warranty_histories_penultimate
        ON TReport.warranty_histories_id_penultimate = warranty_histories_penultimate.id
    LEFT JOIN warranties
        ON TReport.warranty_id = warranties.id
    LEFT JOIN currency_types as currency_types_last
        ON warranty_histories_last.currency_type_id = currency_types_last.id
    LEFT JOIN financial_entities as financial_entities_last
        ON warranty_histories_last.financial_entity_id = financial_entities_last.id
    LEFT JOIN contractors 
        ON warranties.contractor_id = contractors.id
    LEFT JOIN letter_types
        ON warranties.letter_type_id = letter_types.id
    LEFT JOIN warranty_objects
        ON warranties.warranty_object_id = warranty_objects.id
    LEFT JOIN warranty_statuses as warranty_statuses_last
        ON warranty_histories_last.warranty_status_id = warranty_statuses_last.id
    LEFT JOIN currency_types as currency_types_penultimate
        ON warranty_histories_penultimate.currency_type_id = currency_types_penultimate.id
    LEFT JOIN financial_entities as financial_entities_penultimate
        ON warranty_histories_penultimate.financial_entity_id = financial_entities_penultimate.id
    LEFT JOIN warranty_statuses as warranty_statuses_penultimate
        ON warranty_histories_penultimate.warranty_status_id = warranty_statuses_penultimate.id;
END;
$$;

