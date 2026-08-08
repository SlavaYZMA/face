-- Обновление таблицы: округлить время до дня
-- Запустить в Supabase Dashboard → SQL Editor

-- Изменить тип created_at на date (только дата, без времени)
ALTER TABLE requests 
  ALTER COLUMN created_at TYPE date 
  USING created_at::date;

-- Установить default на текущую дату (без времени)
ALTER TABLE requests 
  ALTER COLUMN created_at SET DEFAULT current_date;

-- Проверка
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'requests' AND column_name = 'created_at';
