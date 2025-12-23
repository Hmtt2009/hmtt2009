using System;

namespace SimpleCalculator
{
    class Calculator
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Simple Calculator ===");
            Console.WriteLine();

            while (true)
            {
                try
                {
                    // Get first number
                    Console.Write("Enter first number: ");
                    double num1 = Convert.ToDouble(Console.ReadLine());

                    // Get operator
                    Console.Write("Enter operator (+, -, *, /): ");
                    string operation = Console.ReadLine();

                    // Get second number
                    Console.Write("Enter second number: ");
                    double num2 = Convert.ToDouble(Console.ReadLine());

                    double result = 0;
                    bool validOperation = true;

                    // Perform calculation
                    switch (operation)
                    {
                        case "+":
                            result = num1 + num2;
                            break;
                        case "-":
                            result = num1 - num2;
                            break;
                        case "*":
                            result = num1 * num2;
                            break;
                        case "/":
                            if (num2 == 0)
                            {
                                Console.WriteLine("Error: Cannot divide by zero!");
                                validOperation = false;
                            }
                            else
                            {
                                result = num1 / num2;
                            }
                            break;
                        default:
                            Console.WriteLine("Error: Invalid operator!");
                            validOperation = false;
                            break;
                    }

                    // Display result
                    if (validOperation)
                    {
                        Console.WriteLine($"\nResult: {num1} {operation} {num2} = {result}");
                    }

                    // Ask if user wants to continue
                    Console.WriteLine("\nDo you want to perform another calculation? (y/n): ");
                    string continueChoice = Console.ReadLine()?.ToLower();

                    if (continueChoice != "y" && continueChoice != "yes")
                    {
                        Console.WriteLine("Thank you for using the calculator. Goodbye!");
                        break;
                    }

                    Console.WriteLine();
                }
                catch (FormatException)
                {
                    Console.WriteLine("Error: Please enter valid numbers!");
                    Console.WriteLine();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred: {ex.Message}");
                    Console.WriteLine();
                }
            }
        }
    }
}
