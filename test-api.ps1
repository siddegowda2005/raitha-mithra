# Test API script for RAITHA MITHRA

# Test owner registration
$ownerRegistrationData = @{
    name = "Test Owner User New"
    email = "test_owner_new_123@example.com"
    phone = "9876543255"
    role = "owner"
    location = "Test Location"
    password = "password123"
}

$ownerRegistrationJson = $ownerRegistrationData | ConvertTo-Json

Write-Host "Testing owner registration..."
try {
    $ownerRegistrationResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/register" -Method Post -Body $ownerRegistrationJson -ContentType "application/json"
    Write-Host "Owner registration successful!" -ForegroundColor Green
    Write-Host "Token: $($ownerRegistrationResponse.token)"
    Write-Host "User: $($ownerRegistrationResponse.user | ConvertTo-Json)"
    
    # Save token for subsequent requests
    $ownerToken = $ownerRegistrationResponse.token
} catch {
    Write-Host "Owner registration failed: $_" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode.value__
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody
    }
}

# Test owner login
$ownerLoginData = @{
    phone = "9876543255"
    password = "password123"
}

$ownerLoginJson = $ownerLoginData | ConvertTo-Json

Write-Host "`nTesting owner login..."
try {
    $ownerLoginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method Post -Body $ownerLoginJson -ContentType "application/json"
    Write-Host "Owner login successful!" -ForegroundColor Green
    Write-Host "Token: $($ownerLoginResponse.token)"
    Write-Host "User: $($ownerLoginResponse.user | ConvertTo-Json)"
    
    # Save token for subsequent requests
    $ownerToken = $ownerLoginResponse.token
} catch {
    Write-Host "Owner login failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody
    }
}

# Test equipment creation (as owner)
$equipmentData = @{
    name = "Unique Test Harvester"
    type = "Harvester"
    description = "A test harvester for testing purposes"
    price_per_day = 1500
    location = "Test Location"
    image_url = "https://example.com/harvester.jpg"
}

$equipmentJson = $equipmentData | ConvertTo-Json

Write-Host "`nTesting equipment creation..."
try {
    $headers = @{
        "Authorization" = "Bearer $ownerToken"
    }
    $equipmentResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/equipment" -Method Post -Body $equipmentJson -ContentType "application/json" -Headers $headers
    Write-Host "Equipment creation successful!" -ForegroundColor Green
    Write-Host "Equipment: $($equipmentResponse.equipment | ConvertTo-Json)"
    
    # Save equipment ID for subsequent requests
    $equipmentId = $equipmentResponse.equipment._id
} catch {
    Write-Host "Equipment creation failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody
    }
}

# Test farmer registration
$farmerRegistrationData = @{
    name = "Test Farmer User New"
    email = "test_farmer_new_456@example.com"
    phone = "9876543244"
    role = "farmer"
    location = "Test Location"
    password = "password123"
}

$farmerRegistrationJson = $farmerRegistrationData | ConvertTo-Json

Write-Host "`nTesting farmer registration..."
try {
    $farmerRegistrationResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/register" -Method Post -Body $farmerRegistrationJson -ContentType "application/json"
    Write-Host "Farmer registration successful!" -ForegroundColor Green
    Write-Host "Token: $($farmerRegistrationResponse.token)"
    Write-Host "User: $($farmerRegistrationResponse.user | ConvertTo-Json)"
    
    # Save token for subsequent requests
    $farmerToken = $farmerRegistrationResponse.token
} catch {
    Write-Host "Farmer registration failed: $_" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode.value__
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody
    }
}

# Test farmer login
$farmerLoginData = @{
    phone = "9876543244"
    password = "password123"
}

$farmerLoginJson = $farmerLoginData | ConvertTo-Json

Write-Host "`nTesting farmer login..."
try {
    $farmerLoginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" -Method Post -Body $farmerLoginJson -ContentType "application/json"
    Write-Host "Farmer login successful!" -ForegroundColor Green
    Write-Host "Token: $($farmerLoginResponse.token)"
    Write-Host "User: $($farmerLoginResponse.user | ConvertTo-Json)"
    
    # Save token for subsequent requests
    $farmerToken = $farmerLoginResponse.token
} catch {
    Write-Host "Farmer login failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody
    }
}

# Test booking creation (as farmer)
$bookingData = @{
    equipment_id = $equipmentId
    start_date = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
    end_date = (Get-Date).AddDays(3).ToString("yyyy-MM-dd")
}

$bookingJson = $bookingData | ConvertTo-Json

Write-Host "`nTesting booking creation..."
try {
    $headers = @{
        "Authorization" = "Bearer $farmerToken"
    }
    $bookingResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/bookings" -Method Post -Body $bookingJson -ContentType "application/json" -Headers $headers
    Write-Host "Booking creation successful!" -ForegroundColor Green
    Write-Host "Booking: $($bookingResponse.booking | ConvertTo-Json)"
    
    # Save booking ID for subsequent requests
    $bookingId = $bookingResponse.booking._id
} catch {
    Write-Host "Booking creation failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host $responseBody
    }
}

Write-Host "`nAPI Testing completed!"