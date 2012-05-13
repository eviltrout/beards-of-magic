data = ARGF.read

puts "  map: ["
rows = data.split("\n")

while rows.size < 25 do
  rows = [""] + rows
  rows << "" if rows.size < 25
end

rows.each_with_index do |row, i|

  row.strip!
  while row.size < 80 do
    row = " " + row
    row = row + " " if row.size < 80
  end

  puts "        \"#{row}\"#{i < 24 ? ',' : ''}"
end
puts "       ],"