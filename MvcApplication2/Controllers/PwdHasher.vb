﻿Imports System.Security.Cryptography
'Imports System.IO.IsolatedStorage
Imports System.IO

Public Class PwdHasher

#Region "Fields...Shared"
    'Private Shared ReadOnly Rng As RNGCryptoServiceProvider = New RNGCryptoServiceProvider
    Private Shared HA As SHA256Managed = New SHA256Managed
    Public Shared ReadOnly DefaultSaltSize As Integer = 16
#End Region

    'generateSalt also stores the generated byte array in IsolatedStore.UserFiles...
#Region "EncodeString,Endcode,GenerateSalt Shared Functions"
    'Public Shared Function EncodeNewSalt(ByVal _pswd As String) As PWD_Pkg
    '    Return Encode(_pswd, GenerateSalt(DefaultSaltSize))
    'End Function

    Private Shared Function Encode(ByVal _pswd As String, ByVal _slt As Byte()) As PWD_Pkg
        Using ms As New System.IO.MemoryStream
            Dim pwdb = Text.Encoding.UTF8.GetBytes(_pswd)
            ms.Write(_slt, 0, _slt.Length)
            ms.Write(pwdb, 0, pwdb.Length)
            ms.Seek(0, IO.SeekOrigin.Begin)
            Return New PWD_Pkg(_slt, HA.ComputeHash(ms))
        End Using
    End Function

    'Private Shared Function GenerateSalt(ByVal _Saltsize As Integer) As Byte()
    '    Dim rslt As Byte()
    '    rslt = Array.CreateInstance(GetType(Byte), _Saltsize)
    '    Rng.GetBytes(rslt)
    '    'Using ms As New IO.IsolatedStorage.IsolatedStorageFileStream("NaCl.bin", IO.FileMode.Create, IsolatedStorageFile.GetUserStoreForApplication)
    '    '    ms.Write(rslt, 0, rslt.Length)
    '    'End Using
    '    Return rslt
    'End Function
#End Region


    'Internal Class PWD_Pkg
    Public Class PWD_Pkg
#Region "Fields and New"
        Public ReadOnly Salt As Byte()
        Public ReadOnly PassWordHash As Byte()

        Public Sub New(ByVal _Salt As Byte(), ByVal _PwdHash As Byte())
            Me.Salt = _Salt
            Me.PassWordHash = _PwdHash
        End Sub
#End Region

#Region "PwdHashINT"
        Public ReadOnly Property PwdHashINT() As Integer
            Get
                Return BitConverter.ToInt32(PassWordHash, 0)
            End Get
        End Property
#End Region

#Region "SmartPwdPkg"
        Public Shared Function SmartPwdPkg(ByVal _password As String, ByVal _Reset As Boolean, ByVal _emailAddr As String) As PWD_Pkg
            Dim pwdb = Text.Encoding.UTF8.GetBytes(_emailAddr)
            Return Encode(_password, pwdb.Take(Math.Min(pwdb.Length, DefaultSaltSize)).ToArray)
            'If  Not _Reset Then
            '    Return Encode(_password, SaltFromISOUserCache)
            'Else
            '    'this is effectively a change in the password from the server's perspective...
            '    'have to do a dialogue here to get the Salt that the server's passwdhash was computed with...
            '    'compute the hash with the server's salt
            '    MessageBox.Show("Don't recognize this device...")
            '    Return EncodeNewSalt(_password) 'this uses a generatedsalt...generatedsalt method also stores in ISOUser
            'End If
        End Function
#End Region

        '#Region "SaltFromISOUserCache"
        '        Public Shared Function SaltFromISOUserCache() As Byte() 'returns nothing
        '            Dim FinalUserStoreSalt As Byte() = Nothing
        '            Using isoFile = IsolatedStorageFile.GetUserStoreForApplication()
        '                If isoFile IsNot Nothing AndAlso isoFile.FileExists("NaCl.bmp") Then
        '                    Dim UserStoreSalt As Byte() = New Byte(DefaultSaltSize) {}
        '                    Using isoStream = isoFile.OpenFile("NaCl.bin", FileMode.Open, FileAccess.Read)
        '                        isoStream.Read(UserStoreSalt, 0, DefaultSaltSize)
        '                        FinalUserStoreSalt = New Byte(DefaultSaltSize) {}
        '                        Buffer.BlockCopy(UserStoreSalt, 0, FinalUserStoreSalt, 0, DefaultSaltSize)
        '                    End Using
        '                Else
        '                    'could set finaluserstoresalt to generated salt...generatedsalt method also stores in ISOUser
        '                End If
        '            End Using
        '            Return FinalUserStoreSalt
        '        End Function
        '#End Region


    End Class
End Class
