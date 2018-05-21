Imports System.Runtime.Serialization
Imports System.Xml.Serialization
Imports System.Xml
Imports System.Text
Imports System.IO

Public Class XMLConverter(Of T)
    '''' <summary>
    '''' Convert XMLstring to Object(of T)
    '''' </summary>
    '''' <param name="_xmlString "></param>
    '''' <returns></returns>
    '''' <remarks></remarks>

    Private Shared Serializer As XmlSerializer
    Public Shared Function Initialize() As Boolean
        If IsNothing(Serializer) Then
            Serializer = New XmlSerializer(GetType(T))
        End If
        Return True
    End Function
    Public Shared Function QuickObject(ByRef _xmlstring As String) As T
        'If Serializer Is Nothing Then
        '    Serializer = New XmlSerializer(GetType(T))
        '    MessageBox.Show("Created xmlserializer of " & GetType(T).Name)
        'End If
        Return ToObject(_xmlstring)
    End Function

    ' Public Shared SrlzrDxnry As New Dictionary(Of String, XmlSerializer)
    Public Shared Function ToObject(ByRef _xmlString As String) As T
        'Dim rslt As T = Nothing
        ' Dim Tname = GetType(T).Name
        'Dim strrdr As StringReader = Nothing
        'Dim serializer As XmlSerializer = Nothing
        Try
            Using strrdr = New StringReader(_xmlString)
                _xmlString = ""
                _xmlString = Nothing
                'Using xmlReader As XmlReader = xmlReader.Create(strrdr)

                ' SrlzrDxnry.TryGetValue(Tname, serializer)
                'If serializer Is Nothing Then
                'serializer = New XmlSerializer(GetType(T))
                '    SrlzrDxnry.Add(Tname, serializer)
                'End If
                'serializer = New XmlSerializer(GetType(T))
                ' If Serializer.CanDeserialize(xmlReader) Then

                Return Serializer.Deserialize(strrdr) 'New StringReader(_xmlString))

                'Else
                '    MessageBox.Show("XmlConverter(of T).ToObject as " & GetType(T).Name & " can't deserialize the xmlstring")
                '    Return Nothing
                'End If
            End Using


        Catch ex As Exception
            'MessageBox.Show("XmlConverter(of T).ToObject as " & GetType(T).Name & " can't deserialize the xmlstring")
            Return Nothing
            'Finally
            '    'If strrdr IsNot Nothing Then
            '    '    _xmlString = ""
            '    '    strrdr.Close()

            '    '    '_xmlString = Nothing
            '    '    strrdr.Dispose()
            '    '    'strrdr = Nothing
            '    '    'serializer = Nothing
            '    'End If
        End Try


        'serializer = Nothing
        '_xmlString = ""
        '_xmlString = Nothing

        'Return rslt
    End Function
    Public Shared Function ToXmlString(ByVal _obj As T) As String
        'Dim serializer = New XmlSerializer(GetType(T))
        If Serializer Is Nothing Then
            Serializer = New XmlSerializer(GetType(T))
            'MessageBox.Show("Created xmlserializer of " & GetType(T).Name)
        End If
        Dim stringbuilder = New StringBuilder

        Try
            Using stringwriter = New StringWriter(stringbuilder)
                Serializer.Serialize(stringwriter, _obj)
            End Using
            Return stringbuilder.ToString
        Catch ex As Exception
            'MessageBox.Show("XMLConverter(of T).ToXmlString reports exception serializing <" & _obj.ToString & ">..." & ex.Message)

            Return Nothing
        Finally
            stringbuilder = Nothing
        End Try
    End Function

    Public Shared Function ToStream(ByVal _obj As T) As MemoryStream
        If Serializer Is Nothing Then
            Serializer = New XmlSerializer(GetType(T))
            'MessageBox.Show("Created xmlserializer of " & GetType(T).Name)
        End If
        Dim ms As New MemoryStream
        Serializer.Serialize(ms, _obj)
        Return ms
    End Function
    Public Shared Function ToObjectFromStream(ByRef _ms As Stream) As T
        Using _ms
            _ms.Seek(0, SeekOrigin.Begin)
            Return Serializer.Deserialize(_ms)
        End Using
    End Function
    'Public Shared Function teststringreader(ByVal xmlstring As String) As String
    '    Dim output As StringBuilder = New StringBuilder()
    '    Dim s As String
    '    'Dim xmlString As String = "<?xml version='1.0'?>" & _
    '    '                "<!-- This is a sample XML document -->" & _
    '    '                "<Items>" & _
    '    '                  "<Item>test with a child element <more/> stuff</Item>" & _
    '    '                "</Items>"
    '    ' Create an XmlReader
    '    Using reader As XmlReader = XmlReader.Create(New StringReader(xmlstring))
    '        'Dim rs = New XmlReaderSettings
    '        'rs.
    '        'dix = XmlReader.Create(xmlstring
    '        Dim ws As XmlWriterSettings = New XmlWriterSettings()
    '        ws.Indent = True
    '        Using writer As XmlWriter = XmlWriter.Create(output, ws)

    '            ' Parse the file and display each of the nodes.
    '            While reader.Read()
    '                Select Case reader.NodeType
    '                    Case XmlNodeType.Element
    '                        writer.WriteStartElement(reader.Name)
    '                    Case XmlNodeType.Text
    '                        writer.WriteString(reader.Value)
    '                    Case XmlNodeType.XmlDeclaration
    '                    Case XmlNodeType.ProcessingInstruction
    '                        writer.WriteProcessingInstruction(reader.Name, reader.Value)
    '                    Case XmlNodeType.Comment
    '                        writer.WriteComment(reader.Value)
    '                    Case XmlNodeType.EndElement
    '                        writer.WriteFullEndElement()
    '                End Select
    '                s = output.ToString
    '            End While
    '        End Using
    '    End Using
    '    s = output.ToString
    '    Return s
    'End Function
End Class