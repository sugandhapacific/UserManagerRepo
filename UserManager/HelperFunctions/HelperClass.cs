using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using UserManager.Models;

namespace UserManager.HelperFunctions
{
    public class HelperClass
    {

        /// <summary>
        /// Gets the users from the database
        /// </summary>
        /// <returns>users</returns>
        public static List<User> GetUserList()
        {
            List<User> users = new List<User>();
            string connStr = ConfigurationManager.ConnectionStrings["SqlConnection"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connStr))
                {
                    using (SqlCommand cmd = new SqlCommand("dbo.spFetchData", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                string lastName = reader[2] == System.DBNull.Value ? null : reader[2].ToString();
                                string email = reader[3] == System.DBNull.Value ? null : reader[3].ToString();
                                long? phone = reader[4] == System.DBNull.Value ? (long?)null : Convert.ToInt64(reader[4]);
                                users.Add(new User
                                {
                                    UserID = Convert.ToInt16(reader[0]),
                                    FirstName = reader[1].ToString(),
                                    LastName = lastName,
                                    Email = email, 
                                    Phone = phone,
                                    Status=reader[5].ToString()});                            
                        }
                    }                       
                  }                    
                }
                return users;
        }

        /// <summary>
        /// Adds new user data to database
        /// </summary>
        /// <param name="fName">first name</param>
        /// <param name="lName">last name</param>
        /// <param name="email">email</param>
        /// <param name="phone">phone</param>
        /// <returns>0 if add failed and 1 if success</returns>
        public static int PushData(string fName, string lName, string email, long? phone)
        {
            string connStr = ConfigurationManager.ConnectionStrings["SqlConnection"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connStr))
            {
                using (SqlCommand cmd = new SqlCommand("dbo.spAddUser", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@FirstName", SqlDbType.NVarChar).Value = fName;
                    cmd.Parameters.Add("@LastName", SqlDbType.NVarChar).Value = lName;
                    cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = email;
                    cmd.Parameters.Add("@Phone", SqlDbType.BigInt).Value = phone;
                        con.Open();
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                return Convert.ToInt16(reader[0]);
                            }
                        }
                }
            }
            return 0;
        }

        /// <summary>
        /// updates the user information in the database
        /// </summary>
        /// <param name="uId">user Id</param>
        /// <param name="fName">first name</param>
        /// <param name="lName">last name</param>
        /// <param name="email">email</param>
        /// <param name="phone">phone</param>
        /// <returns>0 if update failed and 1 if success</returns>
        public static int UpdateData(int uId, string fName, string lName, string email, long? phone, string status)
        {
            string connStr = ConfigurationManager.ConnectionStrings["SqlConnection"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connStr))
            {
                using (SqlCommand cmd = new SqlCommand("dbo.spUpdateUserList", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@UserKey", SqlDbType.Int).Value = uId;
                    cmd.Parameters.Add("@FirstName", SqlDbType.NVarChar).Value = fName;
                    cmd.Parameters.Add("@LastName", SqlDbType.NVarChar).Value = lName;
                    cmd.Parameters.Add("@Email", SqlDbType.NVarChar).Value = email;
                    cmd.Parameters.Add("@Phone", SqlDbType.BigInt).Value = phone;
                    cmd.Parameters.Add("@Status", SqlDbType.NChar).Value = status;
                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader()) 
                    {
                        while (reader.Read())
                        {
                            return Convert.ToInt16(reader[0]);
                        }
                    }
                }
            }
            return 0;
        }


        /// <summary>
        /// deletes user row from database
        /// </summary>
        /// <param name="uId">user Id of the user to be deleted</param>
        /// <returns>0 if delete failed and 1 if success</returns>
        public static int DeleteRow(int uId)
        {
            string connStr = ConfigurationManager.ConnectionStrings["SqlConnection"].ConnectionString;
            using (SqlConnection con = new SqlConnection(connStr))
            {
                using (SqlCommand cmd = new SqlCommand("dbo.spDeleteData", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = uId;                   
                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            return Convert.ToInt16(reader[0]);
                        }
                    }
                }
            }
            return 0;
        }
    }
}