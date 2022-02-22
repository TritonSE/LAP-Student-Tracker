const expected: User[] = [
    {
      id: "2",
      firstName: "Teacher",
      lastName: "Doe",
      email: "teacher@gmail.com",
      role: "Teacher",
      address: "123 Main Street",
      phoneNumber: "1234567890",
    },
    {
      id: "3",
      firstName: "Admin",
      lastName: "Doe",
      email: "admin@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phoneNumber: "1234567890",
    },
  ];
  await makeHTTPRequest(
    staffHandler,
    "/api/staff",
    undefined,
    "GET",
    undefined,
    StatusCodes.ACCEPTED,
    expected
  );